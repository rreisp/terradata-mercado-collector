// GlobalStyles.js
import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default StyleSheet.create({
    // col1: { width: '8.3333333333333%' },
    // col2: { width: '16.666666667%' },
    // col3: { width: '25%' },
    // col4: { width: '33.333333333%' },
    // col5: { width: '41.666666667%'},
    // col6: { width: '50%' },
    // col7: { width: '58.333333333%' },
    // col8: { width: '66.666666667%' },
    // col9: { width: '75%' },
    // col10: { width: '83.333333333%' },
    // col11: { width: '91.666666667%' },
    // col12: { width: '100%' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    col: { flex: 1 },
    col1: { width: '8.33333%' },
    col2: { width: '16.66667%' },
    col3: { width: '25%' },
    col4: { width: '33.33333%' },
    col5: { width: '41.66667%' },
    col6: { width: '50%' },
    col7: { width: '58.33333%' },
    col8: { width: '66.66667%' },
    col9: { width: '75%' },
    col10: { width: '83.33333%' },
    col11: { width: '91.66667%' },
    col12: { width: '100%' },
    container: {
        padding: 16,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        paddingBottom: 25,
        flexGrow: 1
    },
    fieldContainer: {
        paddingBottom: 5
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 2
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    textMuted: {
        color: '#ccc'
    },
    logo: {
        width: 300,
    },
    input: { borderWidth: 1, borderRadius: 5, borderColor: '#ccc', padding: 8, marginHorizontal: 1, marginBottom: 0 },
    iconButton: {
        width: 32,
        height: 32
    },
    primaryButton: {
        backgroundColor: '#007bff',
        padding: 7,
        borderRadius: 5,
        alignItems: 'center',
        fontWeight: 'bold'
    },
    warnButton: {
        backgroundColor: '#FFA500',
        padding: 7,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 'bold',
    },
    dangerButton: {
        backgroundColor: '#dc3545',
        padding: 7,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 'bold'
    },
    disabledInput: { backgroundColor: '#eee', borderWidth: 1, borderRadius: 5, borderColor: '#ccc', padding: 8, flex: 1, marginHorizontal: 1, marginBottom: 0 },
    disabledButton: {
        backgroundColor: '#ccc',
        padding: 7,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        flex: 1
    },
    centered: {
        flex: 1, // ocupa toda a tela
        justifyContent: 'center', // alinha verticalmente
        alignItems: 'center',     // alinha horizontalmente
    },
    leftAligned: {
        flex: 1, // ocupa toda a tela
        justifyContent: 'flex-start', // alinha verticalmente
        alignItems: 'flex-start',     // alinha horizontalmente
    },
    rightAligned: {
        flex: 1, // ocupa toda a tela
        justifyContent: 'flex-end', // alinha verticalmente
        alignItems: 'flex-end',     // alinha horizontalmente
    },
    // picker: { borderWidth: 0, padding: 8 },
    picker: { borderWidth: 0, marginVertical: -9, marginHorizontal: -7, color: "#000" },
    pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    errorTitle: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        fontWeight: "bold"
    },    
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    errorBox: {
        width: '100%',
        padding: 16,
        borderWidth: 1,
        borderColor: '#FFCC80',
        borderRadius: 8,
        backgroundColor: '#FFF3E0',
    },  
});
