import re
import random
from django.shortcuts import render

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def title(request, title):
    content = util.get_entry(title)
    if content:
        title, content = util.distinct_entry(content)
        return render(request, "encyclopedia/title.html", {
            "name": title,
            "content": content
        })
    else:
        return render(request, "encyclopedia/error.html", {
            "name": title,
            "error": "Not exist"
        })


def search(request):
    title = request.GET
    title = title["q"].strip()
    
    found_titles = util.search_entry(title)

    if len(found_titles) == 1 and found_titles[0].lower() == title.lower():
        content = util.get_entry(found_titles[0])
        name, content = util.distinct_entry(content)
        return render(request, "encyclopedia/title.html", {
            "name": name,
            "content": content
        })
    
    elif found_titles == None:
        return render(request, "encyclopedia/search.html")
    
    else:
        return render(request, "encyclopedia/search.html", {
            "found_titles": found_titles
        })


def create(request):
    if request.method == "POST":
        name = request.POST["Title"].strip()
        content = request.POST["Content"].strip()
        if util.get_entry(name.title()):
            return render(request, "encyclopedia/error.html", {
                "name": name,
                "error": "Exist"
        })

        util.save_entry(name.title(), content)
        content = util.get_entry(name)
        name, content = util.distinct_entry(content)
        return render(request, "encyclopedia/title.html", {
            "name": name,
            "content": content
        })
    
    else:
        return render(request, "encyclopedia/create.html")


def edit(request):
    if request.method == "GET":
        name = request.GET["Title"].strip()
        content = util.get_entry(name)

        return render(request, "encyclopedia/edit.html", {
            "name": name,
            "content": content
        })
    
    elif request.method == "POST":
        name = request.POST["Title"].strip()
        content = request.POST["Content"]
        util.save_entry(name, content)
        
        content = util.get_entry(name)
        name, content = util.distinct_entry(content)
        return render(request, "encyclopedia/title.html", {
            "name": name,
            "content": content
        })


def get_random(request):
    title = random.choice(util.list_entries())
    
    content = util.get_entry(title)
    name, content = util.distinct_entry(content)
    return render(request, "encyclopedia/title.html", {
        "name": name,
        "content": content
    })
    

    