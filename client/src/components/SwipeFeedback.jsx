import { useMatchStore } from "../store/useMatchStore";

const getFeedbackStyle = (swipeFeedback) => {
  if (swipeFeedback === "liked") return "text-green-400";
  if (swipeFeedback === "passed") return "text-red-400";
  if (swipeFeedback === "matched") return "text-pink-400";
  return "";
};

const getFeedbackText = (swipeFeedback) => {
  if (swipeFeedback === "liked") return "Liked!";
  if (swipeFeedback === "passed") return "Passed";
  if (swipeFeedback === "matched") return "It's a Match!";
  return "";
};

const SwipeFeedback = () => {
  const { swipeFeedback } = useMatchStore();

  return (
    <div className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none z-50">
      {swipeFeedback && (
        <span
          className={`
            px-6 py-3 rounded-xl bg-black/60
            text-3xl font-bold drop-shadow
            ${getFeedbackStyle(swipeFeedback)}
            transition-all duration-300
          `}
        >
          {getFeedbackText(swipeFeedback)}
        </span>
      )}
    </div>
  );
};

export default SwipeFeedback;
