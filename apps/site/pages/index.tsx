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
  const filePath = path.join(process.cwd(), "apps/site/public/tilda.html");
  let html = "";

  try {
    html = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error("Ошибка чтения файла Tilda:", err);
  }

  return {
    props: {
      html,
    },
  };
};
