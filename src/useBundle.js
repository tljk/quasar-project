import axios from "axios";

export async function getLatestBundle() {
  const res = await axios.get(process.env.GITHUB_API + "releases/latest");
  if (res.status !== 200) {
    throw new Error("Failed to fetch latest bundle");
  }
  const changeLog = res.data.body;
  const bundleId = res.data.tag_name;
  const bundleUrl = res.data.assets.find(
    (item) => item.name == "release.zip"
  ).browser_download_url;
  return { changeLog, bundleId, bundleUrl };
}
