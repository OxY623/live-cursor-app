import { useState } from "react";

type Props = {
  onSubmit: (name: string) => void;
  //   [key: string]: any;
};

function Login({ onSubmit }: Props) {
  const [username, setUsername] = useState<string>("");

  return (
    <div>
      <h1>Welcome</h1>
      <p>What should people call you?</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(username);
        }}
      >
        <div className="wrapper">
          <label htmlFor="username">Username:</label>
          <input
            placeholder="Your username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
