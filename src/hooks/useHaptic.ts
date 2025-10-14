/**
 * Custom hook for haptic feedback
 */

import { hapticManager } from '../utils/hapticManager'

type HapticType = 'click' | 'hover' | 'success' | 'error' | 'button'

export const useHaptic = () => {
  const triggerHaptic = (type: HapticType) => {
    switch (type) {
      case 'click':
        hapticManager.click()
        break
      case 'hover':
        hapticManager.hover()
        break
      case 'success':
        hapticManager.success()
        break
      case 'error':
        hapticManager.error()
        break
      case 'button':
        hapticManager.buttonPress()
        break
      default:
        hapticManager.click()
    }
  }

  return { triggerHaptic }
}
