import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-vitest";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import MainLayout from "./MainLayout.vue";

installQuasarPlugin();

describe("MainLayout", () => {
  it("should mount component properly", () => {
    const wrapper = mount(MainLayout);
    expect(wrapper.exists()).to.be.true;
  });
});
