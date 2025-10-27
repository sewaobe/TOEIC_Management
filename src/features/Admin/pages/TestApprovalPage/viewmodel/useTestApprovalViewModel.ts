import { useState, useMemo } from "react";
import { TestItem } from "../mock/mockTests";

export function useTestApprovalViewModel(initialTests: TestItem[]) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [creator, setCreator] = useState("");
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = useMemo(() => {
    return initialTests.filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) &&
        (status ? t.status === status : true) &&
        (type ? t.type === type : true) &&
        (creator ? t.creator === creator : true) &&
        (topic ? t.topic === topic : true)
    );
  }, [initialTests, search, status, type, creator, topic]);

  const paginated = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  return {
    search,
    setSearch,
    status,
    setStatus,
    type,
    setType,
    creator,
    setCreator,
    topic,
    setTopic,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    filtered,
    paginated,
  };
}
