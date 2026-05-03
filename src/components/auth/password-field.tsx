"use client";

import { useState } from "react";

type PasswordFieldProps = {
  label: string;
  minLength?: number;
  name: string;
};

export function PasswordField({ label, minLength, name }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label>
      {label}
      <span className="password-control">
        <input
          minLength={minLength}
          name={name}
          required
          type={isVisible ? "text" : "password"}
        />
        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="password-toggle"
          onClick={() => setIsVisible((current) => !current)}
          type="button"
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </span>
    </label>
  );
}
