export default function IdeaCard({ idea }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border-l-4 border-blue-500">
      <p className="text-lg text-gray-800">{idea}</p>
    </div>
  );
}