import { View, TouchableOpacity, StyleSheet } from "react-native"

/**
 * A cross-platform touchable component that properly handles pointerEvents
 * and shadow styling across different platforms.
 */
const TouchableView = ({
  children,
  onPress,
  style,
  activeOpacity = 0.7,
  disabled = false,
  pointerEvents,
  ...props
}) => {
  // Create a style object that includes pointerEvents if provided
  const viewStyle = pointerEvents ? [style, { pointerEvents }] : style

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
      style={styles.touchable}
      {...props}
    >
      <View style={viewStyle}>{children}</View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {
    // Ensure the touchable doesn't add any unwanted styling
  },
})

export default TouchableView
