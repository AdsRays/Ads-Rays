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
  // Определяем путь именно от корня site
  const filePath = path.join(__dirname, "..", "public", "tilda.html");
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
