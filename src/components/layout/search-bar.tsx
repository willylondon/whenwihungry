type SearchBarProps = {
  action: string;
  buttonLabel?: string;
  defaultValue?: string;
  placeholder?: string;
};

export function SearchBar({
  action,
  buttonLabel = "Search",
  defaultValue,
  placeholder = "Search jerk, lunch trucks, parishes, and more"
}: SearchBarProps) {
  return (
    <form action={action} className="search-bar">
      <input
        aria-label="Search places"
        className="search-input"
        defaultValue={defaultValue}
        name="q"
        placeholder={placeholder}
        type="search"
      />
      <button className="btn btn-primary search-submit" type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}
