import fs from "fs";
import path from "path";
import { GetStaticProps } from "next";

type Props = {
  html: string;
};

export default function Home({ html }: Props) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Универсальный путь для локали и Vercel
  const baseDir = process.env.VERCEL
    ? path.join(process.cwd(), "public") // внутри Vercel
    : path.join(process.cwd(), "apps/site/public"); // локально

  const filePath = path.join(baseDir, "tilda.html");
  let html = "";

  try {
    html = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error("Ошибка чтения Tilda HTML:", err);
  }

  return {
    props: {
      html,
    },
  };
};
