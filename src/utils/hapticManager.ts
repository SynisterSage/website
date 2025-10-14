/**
 * Haptic Feedback Manager
 * Provides vibration feedback for supported devices
 */

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection'

class HapticManager {
  private enabled: boolean = true
  private supported: boolean = false

  constructor() {
    // Check if device supports vibration
    this.supported = 'vibrate' in navigator

    // Check localStorage for user preference
    const savedEnabled = localStorage.getItem('hapticEnabled')
    this.enabled = savedEnabled !== 'false' // default to true
  }

  private getPattern(type: HapticPattern): number | number[] {
    switch (type) {
      case 'light':
        return 10 // 10ms vibration
      case 'medium':
        return 20 // 20ms vibration
      case 'heavy':
        return 50 // 50ms vibration
      case 'success':
        return [20, 50, 20] // Short, pause, short
      case 'error':
        return [50, 100, 50] // Long, pause, long
      case 'selection':
        return 15 // Quick tap
      default:
        return 10
    }
  }

  vibrate(pattern: HapticPattern) {
    if (!this.enabled || !this.supported) return

    const vibrationPattern = this.getPattern(pattern)
    
    try {
      navigator.vibrate(vibrationPattern)
    } catch (error) {
      // Silently fail if vibration is not supported or blocked
      console.debug('Haptic feedback not available:', error)
    }
  }

  toggle() {
    this.enabled = !this.enabled
    localStorage.setItem('hapticEnabled', String(this.enabled))
    
    // Provide feedback when enabling
    if (this.enabled && this.supported) {
      this.vibrate('medium')
    }
    
    return this.enabled
  }

  isEnabled() {
    return this.enabled
  }

  isSupported() {
    return this.supported
  }

  // Convenience methods for common interactions
  click() {
    this.vibrate('light')
  }

  buttonPress() {
    this.vibrate('medium')
  }

  success() {
    this.vibrate('success')
  }

  error() {
    this.vibrate('error')
  }

  hover() {
    this.vibrate('selection')
  }
}

// Export singleton instance
export const hapticManager = new HapticManager()
