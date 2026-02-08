import streamlit as st
from google import genai
import matplotlib.pyplot as plt
import numpy as np

# כותרת האפליקציה (עיצוב אוטומטי של סטרימליט)
st.title("🤖 יועץ תעסוקתי ווירטואלי")
st.markdown("---")

# משיכת ה-API Key מההגדרות המאובטחות (Secrets)
try:
    api_key = st.secrets["GEMINI_API_KEY"]
    client = genai.Client(api_key=api_key)
except Exception:
    st.error("שגיאה: לא נמצא API Key בהגדרות המערכת.")
    st.stop()

# ניהול היסטוריית השיחה בתוך הזיכרון של הדף
if "messages" not in st.session_state:
    st.session_state.messages = []

# הצגת הודעות קודמות (כמו בוואטסאפ)
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# תיבת קלט למשתמש
if prompt := st.chat_input("איך אוכל לעזור לך היום?"):
    # הוספת הודעת המשתמש למסך
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # שליחה למודל Gemini (לפי ההגדרות בפרויקט שלך)
    with st.chat_message("assistant"):
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash", 
                contents=prompt
            )
            full_response = response.text
            st.markdown(full_response)
            st.session_state.messages.append({"role": "assistant", "content": full_response})
        except Exception as e:
            st.error(f"קרתה שגיאה בחיבור ל-Gemini: {e}")

# כפתור צדדי לניתוח נתונים (כמו בפרויקט המקורי שלך)
with st.sidebar:
    st.header("אפשרויות נוספות")
    if st.button("בצע ניתוח והדמיית נתונים"):
        st.write("מנתח את השיחה הנוכחית...")
        # כאן אפשר להוסיף את הלוגיקה של ה-Plotting מהפרויקט שלך
        fig, ax = plt.subplots()
        ax.pie([10, 20, 30], labels=['עניין', 'שכר', 'יציבות'], autopct='%1.1f%%')
        st.pyplot(fig)