import A from "./A";
import { Projects } from "../data/Project";
import StarIcon from "./StarIcon";
import ForkIcon from "./ForkIcon";
import hooks from "../css-hooks";

function ProjectListItemDetail({
  children,
}: {
  children?: JSX.Node | JSX.Node[];
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.375em" }}>
      {children}
    </div>
  );
}

export type Props = {
  children: Projects[number];
};

export default function ProjectListItem({ children }: Props) {
  const { url, name, description, language, stars, forks } = children;
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <A href={url} style={{ fontSize: "1.25em", fontWeight: 700 }}>
        {name}
      </A>
      <p style={{ margin: 0, marginTop: "0.5em", flex: 1, lineHeight: 1.5 }}>
        {description}
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1.25em",
          marginTop: "2em",
        }}
      >
        <ProjectListItemDetail>
          <div
            style={hooks({
              width: "0.75em",
              height: "0.75em",
              borderRadius: "999px",
              backgroundColor: language.color,
              dark: { boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.2)" },
            })}
          />
          {language.name}
        </ProjectListItemDetail>
        <ProjectListItemDetail>
          <StarIcon />
          {stars}
        </ProjectListItemDetail>
        {!!forks && (
          <ProjectListItemDetail>
            <ForkIcon />
            {forks}
          </ProjectListItemDetail>
        )}
      </div>
    </div>
  );
}
