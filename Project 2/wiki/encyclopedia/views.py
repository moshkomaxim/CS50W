import re
import random
import markdown2
from django.shortcuts import render, redirect

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def title(request, title):
    content = util.get_entry(title)
    if content:
        return render(request, "encyclopedia/title.html", {
            "title": title,
            "content": markdown2.markdown(content)
        })
    else:
        return render(request, "encyclopedia/error.html", {
            "name": title,
            "error": "Not exist"
        })


def search(request):
    query = request.GET.get('q').strip()
    if query in util.list_entries():
        return redirect("title", title=query)
    return render(request, "encyclopedia/search.html", {
        "found_titles": util.search_entry(query)
    })


def create(request):
    if request.method == "POST":
        name = request.POST["Title"].strip()
        content = request.POST["Content"].strip()
        if util.get_entry(name):
            return render(request, "encyclopedia/error.html", {
                "name": name,
                "error": "Exist"
            }) 

        util.save_entry(name, content)
        return redirect("title", title=name)
    else:
        return render(request, "encyclopedia/create.html")


def edit(request):
    if request.method == "POST":
        name = request.POST["Title"].strip()
        content = request.POST["Content"].strip()
        print(name, content)
        util.save_entry(name, content)
        return redirect("title", title=name)

    elif request.method == "GET":
        name = request.GET["Title"].strip()
        content = util.get_entry(name)
        print(name, content)

        return render(request, "encyclopedia/edit.html", {
            "name": name,
            "content": content
        })
    

def get_random(request):
    name = random.choice(util.list_entries())
    
    return redirect("title", title=name)
    

    