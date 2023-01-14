import { useForm } from "react-hook-form";
import { Filter } from "types/filter";

type QuizFilterProps = {
  userFilter: Filter;
  updateFilter: (filter: Filter) => void;
};

export default function QuizFilter({
  userFilter,
  updateFilter,
}: QuizFilterProps) {
  return (
    <form className="flex w-full gap-4 py-4 mb-8">
      <label className="flex flex-col">
        Category
        <select
          name="category"
          value={userFilter.category}
          onChange={(e) =>
            updateFilter({ ...userFilter, category: e.target.value })
          }
          className="w-32 p-1 mt-1 border"
        >
          <option value="Linux">Linux</option>
          <option value="DevOps">DevOps</option>
          <option value="Docker">Docker</option>
          <option value="Code">Code</option>
          <option value="SQL">SQL</option>
        </select>
      </label>
      <label className="flex flex-col">
        Quiz Length
        <select
          name="limit"
          value={userFilter.limit}
          onChange={(e) =>
            updateFilter({ ...userFilter, limit: +e.target.value })
          }
          className="w-32 p-1 mt-1 border"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
        </select>
      </label>
    </form>
  );
}
