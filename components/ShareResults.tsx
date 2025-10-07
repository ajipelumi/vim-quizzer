import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

interface ShareResultsProps {
  score: number;
  totalQuestions: number;
}

export default function ShareResults({
  score,
  totalQuestions,
}: ShareResultsProps) {
  const shareText = `I scored ${score}/${totalQuestions} on the Vim Quiz! How well do you know Vim? Test your skills now!`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="mt-4">
      <p className="text-center mb-3">Share your score:</p>
      <div className="d-flex justify-content-center gap-3">
        <TwitterShareButton
          url={shareUrl}
          title={shareText}
          className="d-flex align-items-center justify-content-center"
        >
          <TwitterIcon size={50} round />
        </TwitterShareButton>

        <FacebookShareButton
          url={shareUrl}
          hashtag={shareText}
          className="d-flex align-items-center justify-content-center"
        >
          <FacebookIcon size={50} round />
        </FacebookShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={shareText}
          separator=" "
          className="d-flex align-items-center justify-content-center"
        >
          <WhatsappIcon size={50} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
}
