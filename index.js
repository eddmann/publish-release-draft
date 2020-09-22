const core = require("@actions/core");
const { Octokit } = require("@octokit/action");

async function run() {
  const octokit = new Octokit();

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const { data: releases } = await octokit.repos.listReleases({
    owner,
    repo,
  });

  if (releases.length === 0) {
    core.info("Unable to find latest release");
    return;
  }

  const release = releases[0];

  if (release.draft) {
    core.info(`Publishing release ${release.id} (${release.tag_name})`);

    await octokit.request("PATCH /repos/:owner/:repo/releases/:release_id", {
      owner,
      repo,
      release_id: release.id,
      draft: false,
    });
  }
}

run();
