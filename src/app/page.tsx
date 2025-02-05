import ProgressBar from "@/components/ProgressBar";

export default function Home() {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-3">Today&apos;s Calories</h2>
          <ProgressBar limit={3000} currentValue={75} color="green" />
        </div>
      </div>
    </div>
  );
}
