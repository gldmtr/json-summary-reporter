import { getBooleanInput, getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { join, normalize } from "path";
import { getComparison, IComparison } from "./comparison";
import { getCoverageFiles, writeOutput } from "./fileIo";
import { getCommentBodyLines } from "./tables";

const githubActionsBotId = 41898282;

const main = async () => {
	const baseCoverageFile = getInput("base-coverage-file", { required: true });
	const currentCoverageFile = getInput("current-coverage-file", { required: true });
	const commentHeader = getInput("comment-header");
	const appRootCommon = normalize(join(process.env.GITHUB_WORKSPACE, getInput("app-root")));
	const commentOnNoChanges = getBooleanInput("comment-on-no-changes");
	const commentText = await getComparisonComment(baseCoverageFile, currentCoverageFile, commentHeader, appRootCommon, commentOnNoChanges);
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
		if (commentText) {
			await github.rest.issues.updateComment({
				comment_id: existingCommentIds[0],
				owner: context.repo.owner,
				repo: context.repo.repo,
				issue_number: context.payload.pull_request.number,
				body: commentText,
			});
		} else {
			await github.rest.issues.deleteComment({
				comment_id: existingCommentIds[0],
				owner: context.repo.owner,
				repo: context.repo.repo,
				issue_number: context.payload.pull_request.number,
			});
		}
	} else {
		if (commentText) {
			await github.rest.issues.createComment({
				owner: context.repo.owner,
				repo: context.repo.repo,
				issue_number: context.payload.pull_request.number,
				body: commentText,
			});
		}
	}
};

const hasComparisonChanged = (comparison: IComparison): boolean => {
	if (
		Object.keys(comparison.changed).length > 0 ||
		Object.keys(comparison.deleted).length > 0 ||
		Object.keys(comparison.new).length > 0 ||
		comparison.summary.branches.base != comparison.summary.branches.current ||
		comparison.summary.functions.base != comparison.summary.functions.current ||
		comparison.summary.lines.base != comparison.summary.lines.current ||
		comparison.summary.statements.base != comparison.summary.statements.current
	) {
		return true;
	}
	return false;
};

export const getComparisonComment = async (
	baseCoverageFile: string,
	currentCoverageFile: string,
	commentHeader: string,
	appRoot?: string,
	commentOnNoChanges?: boolean
): Promise<string | null> => {
	const { base, current } = await getCoverageFiles(baseCoverageFile, currentCoverageFile);
	const comparison = getComparison(base, current);
	if (hasComparisonChanged(comparison) || commentOnNoChanges) {
		const outputLines = getCommentBodyLines(commentHeader, comparison, appRoot);
		return outputLines.join("\r\n");
	} else {
		return null;
	}
};

const debugMain = async () => {
	const commentText = await getComparisonComment(
		"test-data/base-coverage.json",
		"test-data/new-coverage.json",
		"My Lovely Header",
		"/workspaces/srw-ui/main/directory"
	);
	await writeOutput(commentText, "./test-output/output.md");
};

if (process.env.NODE_ENV === "DEBUG") {
	debugMain();
} else {
	main();
}
