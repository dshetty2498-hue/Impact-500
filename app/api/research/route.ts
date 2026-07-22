import { apiSuccess } from "@/lib/api";
import { platformRepository } from "@/lib/repositories/platform";
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").toLowerCase();
  const category = params.get("category");
  const data = platformRepository
    .research()
    .filter(
      (article) =>
        (!query ||
          `${article.title} ${article.excerpt} ${article.author} ${article.tags.join(" ")}`
            .toLowerCase()
            .includes(query)) &&
        (!category || article.category === category),
    );
  return apiSuccess(data);
}
