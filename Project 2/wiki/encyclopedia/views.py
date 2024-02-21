import re
from django.shortcuts import render

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def title(request, title):
    content = util.get_entry(title)
    if content:
        name_position = content.find('\n')
        name = title
        content = content[name_position:]
        return render(request, "encyclopedia/title.html", {
            "name": name,
            "content": content
        })
    else:
        return render(request, "encyclopedia/error.html", {
            "name": title
        })
