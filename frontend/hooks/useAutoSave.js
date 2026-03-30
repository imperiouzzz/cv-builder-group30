import { useEffect, useRef, useCallback } from 'react';
import { useCVStore } from '@/store/cvStore';
import { cvAPI } from '@/lib/api';
const DEBOUNCE_MS = 1500; // wait 1.5 s after last keystroke before saving

/**
 * Watches `cv` in the store for changes and auto-saves to the
 * backend whenever `isDirty` is true and a CV id is present.
 *
 * Usage:  call once at the builder layout level.
 */
export function useAutoSave() {
  const {
    cv,
    isDirty,
    isSaving,
    setIsSaving,
    setCV
  } = useCVStore();
  const timerRef = useRef(null);
  const save = useCallback(async () => {
    if (!cv.id || isSaving) return;
    setIsSaving(true);
    try {
      const res = await cvAPI.save(cv.id, cv);
      // Merge back the server response (e.g. updated atsScore, updatedAt)
      setCV(res.data.data);
    } catch (err) {
      console.error('[AutoSave] failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [cv, isSaving, setIsSaving, setCV]);
  useEffect(() => {
    if (!isDirty || !cv.id) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cv, isDirty, save]);
}