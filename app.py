import streamlit as st
from google import genai
import os

# 1. Page Config
st.set_page_config(page_title="Project Kick-off Generator", layout="centered")

# 2. Input Fields (This is your Intake Form)
st.title("Project Kick-off Generator")
products = st.multiselect("Select Products", ["Web Accessibility", "Recreation Management", "Mass Notification", "Utility Billing", "Social Media Archiving", "Next Request", "Community Development", "Agenda & Meeting Management", "Codification"])
design_package = st.selectbox("Design Package", ["Standard", "Professional", "Enterprise"])
integrations = st.multiselect("Integrations", ["Payment Gateway", "Social Media", "Cloud Storage", "Email Marketing", "Web Analytics", "Mapping", "ERP"])
st_pref = st.text_input("Preferred Communication Style")

# 3. Generation Logic
if st.button("Generate Email"):
    # Initialize the client (API Key will be pulled from Streamlit Secrets)
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    prompt = f"""
    Act as a Project Implementation Manager. Generate a professional kick-off email.
    Products: {products}
    Design Package: {design_package}
    Integrations: {integrations}
    Communication Style: {st_pref}
    
    Follow these instructions:
    1. Reference the specific Value Hook for each product selected.
    2. Include a Project Timeline section based on the design package.
    3. Include technical reassurance for each selected integration.
    """
    
    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    st.write(response.text)