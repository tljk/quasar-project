import axios from "axios";
import { Notify } from "quasar";
import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { useAppStore } from "src/stores/appStore";

export async function getLatestBundle() {
  return await axios
    .get(process.env.GITHUB_API + "releases/latest")
    .then((res) => {
      const changeLog = res.data.body;
      const bundleId = res.data.tag_name;
      const bundleUrl = res.data.assets.find(
        (item) => item.name == "release.zip"
      ).browser_download_url;
      return { changeLog, bundleId, bundleUrl };
    })
    .catch((error) => {
      Notify.create({
        message: `Error getting latest bundle: ${error.message}`,
      });
    });
}

export async function downloadBundle() {
  const appStore = useAppStore();
  const { bundleId, bundleUrl } = appStore.latestBundle;
  await LiveUpdate.downloadBundle({
    url: bundleUrl,
    bundleId: bundleId,
  })
    .then(async () => {
      await LiveUpdate.setBundle({ bundleId: bundleId });
      appStore.setLatestBundle(undefined);
    })
    .catch((error) => {
      Notify.create({
        message: `Error downloading bundle: ${error.message}`,
      });
    });
}

export async function checkForUpdates(download = false) {
  const appStore = useAppStore();
  if (appStore.networkStatus?.connected) {
    appStore.setLatestBundle(await getLatestBundle());
    if (appStore.latestBundle && download) {
      await downloadBundle();
    }
  }
}
