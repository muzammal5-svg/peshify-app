export async function fetchHearingFilterOptions(client) {
  try {
    const [causeListRes, caseTypesRes] = await Promise.all([
      client.from("v_cause_list").select("hearing_court_no,hearing_judge,case_type_id,case_type_name").limit(1000),
      client.from("case_types").select("id,name").order("name"),
    ]);

    const rows = causeListRes.data ?? [];
    const courts = [...new Set(rows.map(row => row.hearing_court_no).filter(Boolean))];
    const judges = [...new Set(rows.map(row => row.hearing_judge).filter(Boolean))];

    let caseTypes = (caseTypesRes.data ?? []).map(t => ({ id: t.id, name: t.name }));
    if (caseTypes.length === 0) {
      const caseTypeMap = new Map(
        rows.flatMap(row => row.case_type_id && row.case_type_name
          ? [[row.case_type_id, row.case_type_name]]
          : [])
      );
      caseTypes = [...caseTypeMap].map(([id, name]) => ({ id, name }));
    }

    return { courts, judges, caseTypes };
  } catch (err) {
    console.error("[hearingFilterOptions] error:", err);
    return { courts: [], judges: [], caseTypes: [] };
  }
}