const PREVIEW_HOST_MARKERS = ["lovableproject.com", "id-preview--"];

function isPreviewCheckoutHost(hostname: string) {
  return PREVIEW_HOST_MARKERS.some((marker) => hostname.includes(marker));
}

export function createStripeCheckoutRedirect() {
  const usePreviewTab = typeof window !== "undefined" && isPreviewCheckoutHost(window.location.hostname);
  const previewTab = usePreviewTab ? window.open("", "_blank") : null;

  if (previewTab && !previewTab.closed) {
    previewTab.document.title = "Opening secure checkout…";
    previewTab.document.body.innerHTML = "<div style=\"font-family:Inter,system-ui,sans-serif;padding:24px;color:#0f172a\">Opening secure checkout…</div>";
  }

  return {
    redirect(url: string) {
      if (previewTab && !previewTab.closed) {
        previewTab.location.href = url;
        return;
      }

      window.location.assign(url);
    },
    cancel() {
      if (previewTab && !previewTab.closed) {
        previewTab.close();
      }
    },
  };
}