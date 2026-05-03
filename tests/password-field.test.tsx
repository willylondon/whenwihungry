// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";

import { PasswordField } from "@/components/auth/password-field";

describe("PasswordField", () => {
  it("toggles password visibility", () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    act(() => {
      root.render(<PasswordField label="Password" name="password" />);
    });

    const input = container.querySelector("input");
    const toggle = container.querySelector("button");

    expect(input?.type).toBe("password");
    expect(toggle?.textContent).toBe("Show");

    act(() => {
      toggle?.click();
    });

    expect(input?.type).toBe("text");
    expect(toggle?.textContent).toBe("Hide");
  });
});
