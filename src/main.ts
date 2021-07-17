import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { getComparison } from "./comparison";
import { getCoverageFiles, writeOutput } from "./fileIo";
import { getCommentBodyLines } from "./tables";

const githubActionsBotId = 41898282;

const main = async () => {
	const baseCoverageFile = getInput("base-coverage-file", { required: true });
	const currentCoverageFile = getInput("current-coverage-file", { required: true });
	const commentHeader = getInput("comment-header");
	const appRootCommon = getInput("app-root");
	const commentText = await getComparisonComment(baseCoverageFile, currentCoverageFile, commentHeader, appRootCommon);
	const token = getInput("github-token", { required: true });
	const github = getOctokit(token);

	const allComments = await github.rest.issues.listComments({
		owner: context.repo.owner,
		repo: context.repo.repo,
		issue_number: context.payload.pull_request.number,
	});

	const existingCommentIds = allComments.data
		.filter((x) => x.user.id === githubActionsBotId)
		.filter((x) => x.body.startsWith(`# ${commentHeader}`))
		.map((x) => x.id);

	if (existingCommentIds.length > 0) {
		await github.rest.issues.updateComment({
			comment_id: existingCommentIds[0],
			owner: context.repo.owner,
			repo: context.repo.repo,
			issue_number: context.payload.pull_request.number,
			body: commentText,
		});
	} else {
		await github.rest.issues.createComment({
			owner: context.repo.owner,
			repo: context.repo.repo,
			issue_number: context.payload.pull_request.number,
			body: commentText,
		});
	}
};

export const getComparisonComment = async (baseCoverageFile: string, currentCoverageFile: string, commentHeader: string, appRoot?: string): Promise<string> => {
	const { base, current } = await getCoverageFiles(baseCoverageFile, currentCoverageFile);
	const comparison = getComparison(base, current);
	const outputLines = getCommentBodyLines(commentHeader, comparison, appRoot);
	return outputLines.join("\r\n");
};

const debugMain = async () => {
	const commentText = await getComparisonComment("test-data/base-coverage.json", "test-data/new-coverage.json", "My Lovely Header");
	await writeOutput(commentText, "./test-output/output.md");
};

if (process.env.NODE_ENV === "DEBUG") {
	debugMain();
} else {
	main();
}
