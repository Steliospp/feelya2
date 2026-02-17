import { useRef, useCallback } from 'react';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';

/**
 * Scrolls to top when:
 *  1. Switching tabs (screen gains focus)
 *  2. Re-tapping the already active tab icon
 */
export default function useTabScrollToTop() {
  const scrollRef = useRef(null);

  // Re-tap active tab → scroll to top
  useScrollToTop(scrollRef);

  // Tab switch → scroll to top (no animation so it feels instant)
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo?.({ y: 0, animated: false });
    }, [])
  );

  return scrollRef;
}
