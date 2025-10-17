/**
 * Haptic Feedback Manager
 * Provides vibration feedback for supported devices
 */

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection'

class HapticManager {
  private enabled: boolean = true
  private supported: boolean = false
  private initialized: boolean = false

  constructor() {
    // Delay initialization to ensure we're in browser context
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize() {
    if (this.initialized) return
    
    // Check if device supports vibration
    // Note: iOS Safari doesn't support navigator.vibrate, but we still show the toggle
    // for future compatibility and user preference storage
    const hasVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator
    const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)
    
    // Show toggle on iOS even without vibrate support (for future compatibility)
    // or if vibrate is actually supported
    this.supported = hasVibrate || isIOS

    // Check localStorage for user preference
    try {
      const savedEnabled = localStorage.getItem('hapticEnabled')
      this.enabled = savedEnabled !== 'false' // default to true
    } catch (e) {
      // localStorage not available, keep default
      this.enabled = true
    }
    
    this.initialized = true
    
    console.log('HapticManager initialized:', {
      supported: this.supported,
      hasVibrate,
      isIOS,
      enabled: this.enabled
    })
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
    this.initialize() // Ensure initialized
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
    this.initialize() // Ensure initialized
    this.enabled = !this.enabled
    try {
      localStorage.setItem('hapticEnabled', String(this.enabled))
    } catch (e) {
      // localStorage not available
    }
    
    // Provide feedback when enabling
    if (this.enabled && this.supported) {
      this.vibrate('medium')
    }
    
    return this.enabled
  }

  isEnabled() {
    this.initialize() // Ensure initialized
    return this.enabled
  }

  isSupported() {
    this.initialize() // Ensure initialized
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
