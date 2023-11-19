import sys
import os
import time
import re
import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import base64

#build webdriver
op = webdriver.ChromeOptions()
#op.add_argument('headless')
op.add_argument('--ignore-certificate-errors')
op.add_argument('--ignore-ssl-errors')
driver = webdriver.Chrome(options=op)

LOAD_PAUSE_TIME = 5
SCROLL_PAUSE_TIME = 5
WEB_PAUSE_TIME = 15

def get_insta_images(hashtag):
    '''Returns base64 of photos from a specified hashtag on instagra.com
    Parameters:
        hashtag (str): The desired search query
    Returns:
        images (list): List of images encoded in base64
    '''

    driver.get("https://www.instagram.com/explore/tags/" + str(hashtag) + "/")
    #wait for the element
    WebDriverWait(driver, WEB_PAUSE_TIME).until(EC.presence_of_all_elements_located((By.CLASS_NAME, '_aagv')))
    #pass page source to beautiful soup
    soup = BeautifulSoup(driver.page_source, "html.parser")
    images = soup.findAll(class_= '_aagv')
    time.sleep(10)

get_insta_images('fadehaircut')



