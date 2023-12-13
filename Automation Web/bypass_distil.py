"""
Example to bypass distil security (https://www.distilnetworks.com/) with Selenium.
They use the javascript field navigator.webdriver to ban Selenium
The solution is to inject javascript code before the laoding og the webpage, to set webdriver to false
Works only with chromium driver
"""

from datetime import datetime
import os
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webdriver import WebDriver
import time
import json

from undetected_chromedriver.reactor import logger


def send(driver, cmd, params={}):
    """
    Send command to chromium driver
    """
    resource = "/session/%s/chromium/send_command_and_get_result" % driver.session_id
    url = driver.command_executor._url + resource
    body = json.dumps({'cmd': cmd, 'params': params})
    response = driver.command_executor._request('POST', url, body)
    if response['status']:
        raise Exception(response.get('value'))
    return response.get('value')

def add_script(driver, script):
    """
    Inject script before loading page
    Cf: https://stackoverflow.com/a/47298910
    """
    send(driver, "Page.addScriptToEvaluateOnNewDocument", {"source": script})


def process(driver):
    driver.add_script('const setProperty = () => {     Object.defineProperty(navigator, "webdriver", {       get: () => false,     }); }; setProperty();')
    # load a page
    driver.get('example.com')
    time.sleep(20)



def init_webdriver():
    """
    Init selnium web driver for scraping website
    """
    WebDriver.add_script = add_script
    dir_path = os.path.dirname(os.path.realpath(__file__))
    driver_path = r'%s/lib/chromedriver' % dir_path
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(executable_path=driver_path,  chrome_options=options)
    return driver


if __name__ == '__main__':

    driver = None
    try:
        driver = init_webdriver()
        process(driver)
    except Exception as e:
        logger.error('Error during process %s' % e)
        raise e
    finally:
        if driver is not None:
            driver.close()
