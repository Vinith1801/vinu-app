import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Moon,
  Sun,
  Bell,
  Info,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Music2,
} from 'lucide-react-native';

export const SettingsScreen = () => {
  const handlePress = (action: string) => {
    Alert.alert(action, `You tapped on ${action}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Settings ⚙️</Text>

      {/* GENERAL SETTINGS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        <SettingsItem
          icon={<Moon color="#ccc" size={20} />}
          label="Dark Mode"
          onPress={() => handlePress('Dark Mode')}
        />

        <SettingsItem
          icon={<Bell color="#ccc" size={20} />}
          label="Notifications"
          onPress={() => handlePress('Notifications')}
        />

        <SettingsItem
          icon={<Music2 color="#ccc" size={20} />}
          label="Audio Quality"
          onPress={() => handlePress('Audio Quality')}
        />
      </View>

      {/* PRIVACY & SECURITY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>

        <SettingsItem
          icon={<Shield color="#ccc" size={20} />}
          label="Privacy Policy"
          onPress={() => handlePress('Privacy Policy')}
        />

        <SettingsItem
          icon={<Trash2 color="#ff5c5c" size={20} />}
          label="Clear Cache"
          onPress={() => handlePress('Clear Cache')}
          danger
        />
      </View>

      {/* ABOUT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <SettingsItem
          icon={<Info color="#ccc" size={20} />}
          label="About App"
          onPress={() => handlePress('About App')}
        />

        <SettingsItem
          icon={<LogOut color="#ff5c5c" size={20} />}
          label="Logout"
          onPress={() => handlePress('Logout')}
          danger
        />
      </View>

      <Text style={styles.version}>v1.0.0</Text>
    </ScrollView>
  );
};

// 🔹 Reusable Component
const SettingsItem = ({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.label, danger && {color: '#ff5c5c'}]}>{label}</Text>
      <ChevronRight color="#555" size={18} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: '#999',
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222',
  },
  iconContainer: {
    width: 28,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  version: {
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 13,
  },
});
