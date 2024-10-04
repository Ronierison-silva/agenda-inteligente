import useAuth from "@/hooks/useAuth";

export default function Home() {
  const {user} = useAuth();
  return (
    <div>
      <main>
        <h1>hello word</h1>
        <h3>{user}</h3>
      </main>
    </div>
  );
}
