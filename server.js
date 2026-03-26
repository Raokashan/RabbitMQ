import Fastify from "fastify";
import amqp from "amqplib";

const fastify = Fastify({ logger: true });

let channel;

// RabbitMQ connect
const connectRabbit = async () => {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();

  await channel.assertQueue("task_queue", { durable: true });
};

await connectRabbit();

// API route
fastify.post("/task", async (req, reply) => {
  const { task } = req.body;

  channel.sendToQueue(
    "task_queue",
    Buffer.from(JSON.stringify({ task })),
    { persistent: true }
  );

  console.log("📤 Task sent:", task);

  return { message: "Task added to queue ✅" };
});

// start server
await fastify.listen({ port: 3000 });
console.log("🚀 Server running at http://localhost:3000");