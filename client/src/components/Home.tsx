import type { JSX } from "react";

type Props = {
  username: string;
  status: string;
  component: JSX.Element | null;
};

function Home({ username, status, component, flag }: Props) {
  return (
    <div>
      <h1>Hello {username.toUpperCase()}</h1>
      <h2>{status}</h2>
      {component}
    </div>
  );
}

export default Home;
