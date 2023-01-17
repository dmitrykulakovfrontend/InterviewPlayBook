import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent } from "react";
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
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateFilter({ ...userFilter, [e.target.name]: e.target.value });
    queryClient.invalidateQueries({ queryKey: ["quizzes"] });
  };
  const queryClient = useQueryClient();
  return (
    <form className="flex flex-wrap justify-center w-full gap-4 py-4 mb-8">
      <label className="flex flex-col">
        Category
        <select
          name="category"
          value={userFilter.category}
          onChange={handleChange}
          className="w-32 p-1 mt-1 border shadow-inner"
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
          onChange={handleChange}
          className="w-32 p-1 mt-1 border shadow-inner"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </label>
      <label className="flex flex-col">
        Difficulty
        <select
          name="difficulty"
          value={userFilter.difficulty}
          onChange={handleChange}
          className="w-32 p-1 mt-1 border shadow-inner"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </label>
    </form>
  );
}
