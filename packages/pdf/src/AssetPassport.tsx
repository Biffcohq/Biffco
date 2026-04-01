// @ts-nocheck
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Creamos los estilos vectoriales amigables para PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb', // Biffco primary
    paddingBottom: 10,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b' // Slate 800
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b'
  },
  txHashContainer: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 25
  },
  txHashText: {
    fontSize: 8,
    fontFamily: 'Courier',
    color: '#475569'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4
  },
  rowInfo: {
    flexDirection: 'row',
    marginBottom: 6
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 100,
    color: '#64748b'
  },
  value: {
    fontSize: 10,
    color: '#334155',
    flex: 1
  },
  table: {
    width: 'auto',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#cbd5e1'
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    padding: 5
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cbd5e1',
    padding: 5
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  tableCell: {
    fontSize: 8,
    color: '#334155'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10
  }
});

// Definimos los Props para recibir en la Serverless Function
export interface AssetPassportProps {
  asset: {
    id: string;
    type: string;
    ownerId: string[];
    lineageParentIds?: string[];
    blockchainTxHash?: string;
  };
  events: Array<{
    id: string;
    type: string;
    occurredAt: string;
    signedBy: string;
  }>;
  evidence: Array<{
    filename: string;
    sha256: string;
    status: string;
  }>;
}

export const AssetPassport = ({ asset, events, evidence }: AssetPassportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Asset Passport</Text>
          <Text style={styles.subtitle}>Biffco Chain of Custody Report</Text>
        </View>
        <Text style={{ fontSize: 16, color: '#2563eb', fontWeight: 'bold' }}>BIFFCO</Text>
      </View>

      {/* BLOCKCHAIN ANCHOR / HASHER */}
      <View style={styles.txHashContainer}>
        <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>Immutable Proof Anchor</Text>
        <Text style={styles.txHashText}>TX: {asset.blockchainTxHash || "0x----------------------------------------------------------------"}</Text>
      </View>

      {/* ASSET INFO */}
      <Text style={styles.sectionTitle}>Asset Information</Text>
      <View style={styles.rowInfo}>
        <Text style={styles.label}>Asset ID:</Text>
        <Text style={styles.value}>{asset.id}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{asset.type}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.label}>Current Owner(s):</Text>
        <Text style={styles.value}>{asset.ownerId.length > 0 ? asset.ownerId.join(', ') : 'No claim'}</Text>
      </View>
      
      {asset.lineageParentIds && asset.lineageParentIds.length > 0 && (
         <View style={styles.rowInfo}>
            <Text style={styles.label}>Derived From:</Text>
            <Text style={styles.value}>{asset.lineageParentIds.join(', ')}</Text>
         </View>
      )}

      {/* CHAIN OF CUSTODY TABLE */}
      <Text style={styles.sectionTitle}>Chain of Custody Events</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Date/Time</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Event Type</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Event ID</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Signed By</Text></View>
        </View>
        
        {events.map((evt) => (
          <View style={styles.tableRow} key={evt.id}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{new Date(evt.occurredAt).toLocaleString()}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{evt.type}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{evt.id.slice(0, 10)}...</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{evt.signedBy || 'N/A'}</Text></View>
          </View>
        ))}
      </View>

      {/* EVIDENCE SHA-256 */}
      <Text style={styles.sectionTitle}>Cryptographic Evidence Ledger</Text>
      {evidence.length === 0 ? (
         <Text style={{ fontSize: 9, color: '#64748b' }}>No external evidence embedded.</Text>
      ) : (
         evidence.map((ev, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
               <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#334155' }}>{ev.filename} ({ev.status})</Text>
               <Text style={{ fontSize: 8, fontFamily: 'Courier', color: '#64748b' }}>SHA-256: {ev.sha256}</Text>
            </View>
         ))
      )}

      {/* FOOTER */}
      <Text style={styles.footer} fixed>
        Generated by the Biffco Secure Logistics Platform • Document strictly verified at {new Date().toISOString()}
      </Text>

    </Page>
  </Document>
);
