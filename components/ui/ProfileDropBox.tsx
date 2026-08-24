"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

type Props = {
    currentImageUrl?: string | null;
    onComplete: (url: string) => void;
    size?: number;
    disabled?: boolean;
};

export function ProfileDropBox({
                                   currentImageUrl,
                                   onComplete,
                                   size = 96,
                                   disabled = false,
                               }: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null | undefined>(
        currentImageUrl,
    );

    return (
        <div
            className="profile-drop-box"
            style={{
                width: size,
                height: size,
                margin: "0 auto",
                pointerEvents: disabled ? "none" : "auto",
                opacity: disabled ? 0.5 : 1,
                transition: "opacity 150ms ease",
            }}
        >
            <style>{`
        .profile-drop-box [data-ut-element="button"] {
          position: relative;
        }
        .profile-drop-box [data-ut-element="button"] input[type="file"] {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          opacity: 0;
          appearance: none;
          font-size: 0;
          cursor: inherit;
        }
      `}</style>
            <UploadButton
                endpoint="profileUploader"
                disabled={disabled}
                onClientUploadComplete={(res) => {
                    const url = res?.[0]?.ufsUrl ?? res?.[0]?.url;
                    if (url) {
                        setPreviewUrl(url);
                        onComplete(url);
                    }
                }}
                onUploadError={(error) => {
                    console.error("Profile picture upload failed:", error.message);
                }}
                appearance={{
                    container: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: size,
                        height: size,
                        margin: 0,
                    },
                    button: ({ ready, isUploading }) => ({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: size,
                        height: size,
                        margin: 0,
                        borderRadius: "9999px",
                        padding: 0,
                        boxSizing: "border-box",
                        border: "2px solid rgba(255,255,255,0.9)",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                        backgroundImage: previewUrl ? `url(${previewUrl})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: previewUrl ? "transparent" : "#e5e7eb",
                        position: "relative",
                        overflow: "hidden",
                        cursor: ready && !disabled ? "pointer" : "not-allowed",
                        opacity: isUploading ? 0.6 : 1,
                        transition: "opacity 150ms ease, transform 150ms ease",
                    }),
                    allowedContent: {
                        display: "none",
                    },
                }}
                content={{
                    button: ({ ready, isUploading }) => {
                        if (isUploading) {
                            return (
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                        height: "100%",
                                        background: "rgba(0,0,0,0.35)",
                                    }}
                                >
                  <SpinnerIcon />
                </span>
                            );
                        }

                        return (
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                    height: "100%",
                                    position: "relative",
                                }}
                            >
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        background: previewUrl
                            ? "rgba(0,0,0,0)"
                            : "rgba(0,0,0,0.05)",
                        opacity: previewUrl ? 0 : 1,
                        transition: "opacity 150ms ease, background 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = "1";
                        (e.currentTarget as HTMLElement).style.background =
                            "rgba(0,0,0,0.45)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity =
                            previewUrl ? "0" : "1";
                        (e.currentTarget as HTMLElement).style.background =
                            previewUrl ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.05)";
                    }}
                >
                  <CameraIcon />
                </span>
                                {!previewUrl && !ready && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 10,
                                        }}
                                    >
                    Loading…
                  </span>
                                )}
              </span>
                        );
                    },
                }}
            />
        </div>
    );
}

function CameraIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    );
}

function SpinnerIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ animation: "spin 0.8s linear infinite" }}
        >
            <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
    );
}