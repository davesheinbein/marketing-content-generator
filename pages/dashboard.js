import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import Layout from "../components/Layout";
import IdeaHistory from "../components/Dashboard/IdeaHistory";
import IdeaGenerator from "../components/Dashboard/IdeaGenerator";

/**
 * Streamlined dashboard with consolidated data fetching, modern card layout, and clear feedback.
 */
export default function Dashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quota, setQuota] = useState({ used: 0, limit: 10 });

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const userRes = await fetch("/api/user");
        const userData = await userRes.json();
        setProfile(userData);
        const ideasRes = await fetch("/api/ideas");
        const ideasData = await ideasRes.json();
        setIdeas(ideasData.ideas || []);
        setQuota({ used: ideasData.ideas.length, limit: userData.subscription?.status === "active" ? Infinity : 10 });
      } catch (e) {
        setError("Error loading dashboard");
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const handleNewIdeas = (newIdeas) => {
    setIdeas((prev) => [
      { id: Date.now().toString(), prompt: "You just entered", ideas: newIdeas, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setQuota((q) => ({ ...q, used: q.used + 1 }));
  };

  if (loading) return <Layout><Loader /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      <section className="mb-8">
        <div className="flex items-center gap-4">
          {profile.image && <img src={profile.image} alt={profile.name} className="w-14 h-14 rounded-full" />}
          <div>
            <div className="font-bold text-lg">{profile.name || profile.email}</div>
            <div className="text-sm text-gray-500">
              {profile.subscription?.status === "active"
                ? `Pro (${profile.subscription.plan})`
                : "Free user"}
            </div>
          </div>
        </div>
      </section>
      <IdeaGenerator onNewIdeas={handleNewIdeas} quota={quota} isPro={profile.subscription?.status === "active"} />
      <IdeaHistory ideas={ideas} quota={quota} isPro={profile.subscription?.status === "active"} />
    </Layout>
  );
}