import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { getComparison } from "./comparison";
import { getCoverageFiles, writeOutput } from "./fileIo";
import { getCommentBodyLines } from "./tables";

const main = async () => {
	const baseCoverageFile = getInput("base-coverage-file", { required: true });
	const currentCoverageFile = getInput("current-coverage-file", { required: true });
	const commentHeader = getInput("comment-header");
	const commentText = await getComparisonComment(baseCoverageFile, currentCoverageFile, commentHeader);
	const token = getInput("github-token", { required: true });
	const github = getOctokit(token);

	await github.rest.issues.createComment({
		owner: context.repo.owner,
		repo: context.repo.repo,
		issue_number: context.payload.pull_request.number,
		body: commentText,
	});

	const allComments = await github.rest.issues.listComments({
		owner: context.repo.owner,
		repo: context.repo.repo,
		issue_number: context.payload.pull_request.number,
	});

	console.log(JSON.stringify(allComments));
};

export const getComparisonComment = async (baseCoverageFile: string, currentCoverageFile: string, commentHeader: string): Promise<string> => {
	const { base, current } = await getCoverageFiles(baseCoverageFile, currentCoverageFile);
	const comparison = getComparison(base, current);
	const outputLines = getCommentBodyLines(commentHeader, comparison);
	return outputLines.join("\r\n");
};

const debugMain = async () => {
	const commentText = await getComparisonComment("test-data/base-coverage.json", "test-data/new-coverage.json", "My Lovely Header");
	await writeOutput(commentText, "./test-output/output.md");
};

main();
//debugMain();
