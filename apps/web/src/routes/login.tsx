import { Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  return (
    <Flex direction="column" gap="4" width="50%" mx="auto">
      <Flex direction="column" gap="1">
        <Heading size="5">Login</Heading>
        <Text size="2" color="gray">
          Enter the password to access your parcels
        </Text>
      </Flex>

      <TextField.Root placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button
        onClick={async () => {
          localStorage.setItem("password", password);
          navigate({ to: "/" });
        }}
      >
        Login
      </Button>
    </Flex>
  );
}
