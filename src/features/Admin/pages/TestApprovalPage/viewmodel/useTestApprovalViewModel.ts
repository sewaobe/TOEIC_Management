import { useState, useEffect, useMemo } from "react";
import { TestItem } from "../mock/mockTests";
import adminTestService from "../services/adminTest.service";

export function useTestApprovalViewModel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [creator, setCreator] = useState("");
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [items, setItems] = useState<TestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creatorOptions, setCreatorOptions] = useState<string[]>([]);
  const [topicOptions, setTopicOptions] = useState<string[]>([]);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await adminTestService.list({
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        status: status || undefined,
        topic: topic || undefined,
        type: type || undefined,
      });

      if (res) {
        setItems(res.items || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, search, status, type, topic]);

  // Khi người dùng thay đổi filter thì reset page về 0 để tránh ở page không tồn tại cho filter mới
  useEffect(() => {
    setPage(0);
  }, [search, status, type, topic]);

  // Fetch stable options for creator/topic (so selects don't jump when items change)
  const fetchOptions = async () => {
    try {
      // pull a large page to derive available creators/topics
      const res = await adminTestService.list({ page: 1, limit: 1000 });
      const list = res?.items || [];
      setCreatorOptions(
        Array.from(new Set(list.map((i: any) => i.creator).filter(Boolean)))
      );
      setTopicOptions(
        Array.from(new Set(list.map((i: any) => i.topic).filter(Boolean)))
      );
    } catch (err) {
      setCreatorOptions([]);
      setTopicOptions([]);
    }
  };

  useEffect(() => {
    // fetch once on mount; refetch when search changes to reflect available options for that query
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filtered = useMemo(() => items, [items]);

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
    items,
    total,
    loading,
    refresh: fetch,
    creatorOptions,
    topicOptions,
  } as const;
}
