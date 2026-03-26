import amqp from "amqplib";

const startWorker = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("task_queue", { durable: true });

  console.log("📥 Worker waiting for tasks...");

  channel.consume("task_queue", async (msg) => {
    const data = JSON.parse(msg.content.toString());

    console.log("⚙️ Processing task:", data.task);

    // simulate heavy work
    await new Promise((resolve) => setTimeout(resolve, 8000));

    console.log("✅ Task done:", data.task);

    channel.ack(msg);
  });
};

startWorker();