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
    col: { flex: 1, marginHorizontal: 2 },
    col1: { flex: 0.083333333333333, marginHorizontal: 2 },
    col2: { flex: 0.16666666667, marginHorizontal: 2 },
    col3: { flex: 0.25, marginHorizontal: 2 },
    col4: { flex: 0.33333333333, marginHorizontal: 2 },
    col5: { flex: 0.41666666667, marginHorizontal: 2 },
    col6: { flex: 0.50, marginHorizontal: 2 },
    col7: { flex: 0.58333333333, marginHorizontal: 2 },
    col8: { flex: 0.66666666667, marginHorizontal: 2 },
    col9: { flex: 0.75, marginHorizontal: 2 },
    col10: { flex: 0.83333333333, marginHorizontal: 2 },
    col11: { flex: 0.91666666667, marginHorizontal: 2 },
    col12: { flex: 1, marginHorizontal: 2 },
    container: {
        padding: 16,
        backgroundColor: colors.background,
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
    input: { borderWidth: 1, borderRadius: 5, borderColor: '#ccc', padding: 8, flex: 1, marginHorizontal: 1, marginBottom: 0 },
    primaryButton: {
        backgroundColor: '#007bff',
        padding: 7,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        flex: 1
    },
    warnButton: {
        backgroundColor: '#FFA500',
        padding: 7,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        flex: 1
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
    pickerView: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
    centered: {
        flex: 1, // ocupa toda a tela
        justifyContent: 'center', // alinha verticalmente
        alignItems: 'center',     // alinha horizontalmente
    },
    picker: { borderWidth: 0, padding: 8 },
    // picker: { borderWidth: 0, marginVertical: -9, marginHorizontal: -7}
});
