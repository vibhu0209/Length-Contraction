# Length Contraction Visualiser

Applied Physics I (BS-105), Semester 1 · B.Tech CST, Section R · MAIT, Delhi.

This offline browser demo compares the proper length of a rod with the length an observer measures while the rod moves. For a 100 m rod at 0.8c, the measured length is 60 m.

## Run the demo

1. Install Python 3.10 or newer if needed.
2. Double-click `START_APP.cmd` and leave the terminal open.
3. Open http://127.0.0.1:8765 in Chrome if it does not open automatically.

No packages or internet connection are needed. If the launcher fails, run `python app.py --open` from this folder. If port 8765 is busy, run `python app.py --port 8766 --open` and use the printed address. Stop the server with Ctrl+C.

## Present it

- Enter 100 m, choose 0.8c and click **Apply values**. Compare 100 m with 60 m.
- Click **Align for measurement** to compare both rods from the same starting point. **Sweep speed** illustrates the change across separate constant-speed cases.
- Click **Record reading**, then **Export CSV** before refreshing. The readings are calculated, and the on-screen motion is slowed for display.

## Files

- [Project report](Length_Contraction_Project.docx): cover plus four pages. The last page contains the group presentation photo and learning outcomes. Fill in the submission date before handing it in.
- [Viva guide](VIVA.md): speaking order, key formulas and practice questions.
- `START_APP.cmd`, `app.py`, `index.html`, `styles.css` and `app.js`: the launcher and complete app. Keep these together.
