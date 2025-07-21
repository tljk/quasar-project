import { defineBoot } from "#q-app/wrappers";
import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { Network } from "@capacitor/network";
import { Platform } from "quasar";
import axios from "axios";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({ router }) => {
  const getLatestBundle = () => {
    return axios
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
  };

  const downloadBundle = (bundleId, bundleUrl) => {
    return LiveUpdate.downloadBundle({
      url: bundleUrl,
      bundleId: bundleId,
    })
      .then(() => {
        LiveUpdate.setBundle({ bundleId: bundleId });
      })
      .catch((error) => {
        Notify.create({
          message: `Error downloading bundle: ${error.message}`,
        });
      });
  };

  router.isReady().then(() => {
    if (Platform.is.capacitor && process.env.NODE_ENV === "production")
      LiveUpdate.ready().then(() => {
        LiveUpdate.getBundle().then((value) => {
          const currentBundleId = value.bundleId;

          getLatestBundle().then((value) => {
            const latestBundleId = value.bundleId;
            const latestBundleUrl = value.bundleUrl;

            if (currentBundleId) {
              if (currentBundleId != latestBundleId) {
                Network.getStatus().then((value) => {
                  if (value.connectionType == "wifi")
                    downloadBundle(latestBundleId, latestBundleUrl);
                });
              }
            } else {
              if ("v" + process.env.APP_VERSION != latestBundleId) {
                Network.getStatus().then((value) => {
                  if (value.connectionType == "wifi")
                    downloadBundle(latestBundleId, latestBundleUrl);
                });
              }
            }
          });
        });
      });
  });
});
