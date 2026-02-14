import zipfile
import xml.etree.ElementTree as ET
import os

def extract_xlsx_data(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    try:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            # Read shared strings
            shared_strings = []
            if 'xl/sharedStrings.xml' in zip_ref.namelist():
                with zip_ref.open('xl/sharedStrings.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    for t in root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
                        shared_strings.append(t.text)

            # Read workbook relations to find sheet names
            sheets = {}
            with zip_ref.open('xl/workbook.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                for sheet in root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet'):
                    sheets[sheet.get('name')] = sheet.get('sheetId')

            print(f"Sheets found: {list(sheets.keys())}")

            # Try to find a sheet with "ALFABETIZA"
            target_sheet_name = None
            for name in sheets:
                if "ALFABETIZA" in name.upper():
                    target_sheet_name = name
                    break
            
            if not target_sheet_name:
                print("No ALFABETIZA sheet found.")
                return

            print(f"Reading sheet: {target_sheet_name}")
            # Map sheetId to internal zip path (usually xl/worksheets/sheet[Id].xml)
            # Actually sheetId in workbook.xml is not always the sequential number in the zip
            # But usually they are sequential. Let's try to list worksheets folder.
            worksheet_files = [n for n in zip_ref.namelist() if n.startswith('xl/worksheets/sheet')]
            # For simplicity, let's just peek all of them and look for names
            for ws_path in worksheet_files:
                print(f"--- Content from {ws_path} ---")
                with zip_ref.open(ws_path) as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    rows = []
                    for row in root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
                        cells = []
                        for cell in row.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                            v = cell.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                            if v is not None:
                                val = v.text
                                if cell.get('t') == 's':
                                    val = shared_strings[int(val)]
                                cells.append(val)
                        if cells:
                            print(" | ".join(cells))
                    print("-" * 30)

    except Exception as e:
        print(f"Error: {e}")

file_path = r'C:\Users\ferdi\Downloads\DADOS EJA 2026.xlsx'
extract_xlsx_data(file_path)
