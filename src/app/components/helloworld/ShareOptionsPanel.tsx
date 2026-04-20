import { useState } from "react";
import { Link, QrCode, Check, MessageCircle, Send } from "lucide-react";

export function ShareOptionsPanel() {
  const [linkCopied, setLinkCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const tripLink = "https://helloworld.app/join/tokyo-adventure-2026";

  const copyLink = () => {
    // Fallback method using a temporary textarea
    const textArea = document.createElement("textarea");
    textArea.value = tripLink;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }

    document.body.removeChild(textArea);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-700">Share trip</label>

      <div className="grid grid-cols-2 gap-3">
        {/* Copy Link */}
        <button
          type="button"
          onClick={copyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
        >
          {linkCopied ? (
            <>
              <Check className="w-5 h-5 text-success-600" />
              <span className="text-sm font-medium text-success-700">Link copied!</span>
            </>
          ) : (
            <>
              <Link className="w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors" />
              <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-700 transition-colors">Copy link</span>
            </>
          )}
        </button>

        {/* QR Code */}
        <button
          type="button"
          onClick={() => setShowQR(!showQR)}
          className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-all group ${
            showQR
              ? "bg-primary-50 border-primary-300 text-primary-700"
              : "bg-white border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
          }`}
        >
          <QrCode className={`w-5 h-5 transition-colors ${showQR ? "text-primary-600" : "text-neutral-600 group-hover:text-primary-600"}`} />
          <span className={`text-sm font-medium transition-colors ${showQR ? "text-primary-700" : "text-neutral-700 group-hover:text-primary-700"}`}>
            QR code
          </span>
        </button>
      </div>

      {/* QR Code Display */}
      {showQR && (
        <div className="bg-white p-6 border border-neutral-200 rounded-xl text-center">
          <div className="w-48 h-48 mx-auto bg-white border-2 border-neutral-200 rounded-xl p-4 mb-4">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <rect x="0" y="0" width="200" height="200" fill="white"/>
              <g fill="#0A7EA4">
                {/* QR code pattern simulation */}
                <rect x="10" y="10" width="30" height="30"/>
                <rect x="160" y="10" width="30" height="30"/>
                <rect x="10" y="160" width="30" height="30"/>
                <rect x="50" y="50" width="10" height="10"/>
                <rect x="70" y="50" width="10" height="10"/>
                <rect x="90" y="50" width="10" height="10"/>
                <rect x="110" y="50" width="10" height="10"/>
                <rect x="130" y="50" width="10" height="10"/>
                <rect x="50" y="70" width="10" height="10"/>
                <rect x="90" y="70" width="10" height="10"/>
                <rect x="130" y="70" width="10" height="10"/>
                <rect x="50" y="90" width="10" height="10"/>
                <rect x="70" y="90" width="10" height="10"/>
                <rect x="110" y="90" width="10" height="10"/>
                <rect x="130" y="90" width="10" height="10"/>
                <rect x="70" y="110" width="10" height="10"/>
                <rect x="90" y="110" width="10" height="10"/>
                <rect x="110" y="110" width="10" height="10"/>
                <rect x="50" y="130" width="10" height="10"/>
                <rect x="90" y="130" width="10" height="10"/>
                <rect x="130" y="130" width="10" height="10"/>
              </g>
            </svg>
          </div>
          <p className="text-sm text-neutral-600">Scan to join trip</p>
        </div>
      )}

      {/* Third-party Channels */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-2">Share via</label>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg transition-colors"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">WhatsApp</span>
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#09B83E] hover:bg-[#08A038] text-white rounded-lg transition-colors"
            title="Share on WeChat"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">WeChat</span>
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-lg transition-colors"
            title="Share on Telegram"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium">Telegram</span>
          </button>
        </div>
      </div>
    </div>
  );
}
