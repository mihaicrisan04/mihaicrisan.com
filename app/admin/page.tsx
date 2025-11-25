'use client';

import { useState } from 'react';
import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, RefreshCw, Upload, Database, FileText, Briefcase, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [isUploadingCustom, setIsUploadingCustom] = useState(false);

  const documents = useQuery(api.ingest.getAllDocuments);
  const deleteDocument = useMutation(api.ingest.deleteDocument);
  const ingestAll = useAction(api.ingest.ingestAll);
  const ingestProjects = useAction(api.ingest.ingestProjects);
  const ingestBlogPosts = useAction(api.ingest.ingestBlogPosts);
  const ingestWorkExperience = useAction(api.ingest.ingestWorkExperience);
  const ingestCustomContent = useAction(api.ingest.ingestCustomContent);

  const handleIngestAll = async () => {
    setIsIngesting(true);
    try {
      const result = await ingestAll({});
      toast.success(`Successfully ingested ${result.total} documents`);
    } catch (error) {
      toast.error('Failed to ingest data');
      console.error(error);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleIngestProjects = async () => {
    setIsIngesting(true);
    try {
      const result = await ingestProjects({});
      toast.success(`Ingested ${result.ingested} projects`);
    } catch (error) {
      toast.error('Failed to ingest projects');
      console.error(error);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleIngestBlog = async () => {
    setIsIngesting(true);
    try {
      const result = await ingestBlogPosts({});
      toast.success(`Ingested ${result.ingested} blog posts`);
    } catch (error) {
      toast.error('Failed to ingest blog posts');
      console.error(error);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleIngestWork = async () => {
    setIsIngesting(true);
    try {
      const result = await ingestWorkExperience({});
      toast.success(`Ingested ${result.ingested} work experiences`);
    } catch (error) {
      toast.error('Failed to ingest work experience');
      console.error(error);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleUploadCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please provide both title and content');
      return;
    }

    setIsUploadingCustom(true);
    try {
      await ingestCustomContent({ title: title.trim(), content: content.trim() });
      toast.success('Custom content added successfully');
      setTitle('');
      setContent('');
    } catch (error) {
      toast.error('Failed to add custom content');
      console.error(error);
    } finally {
      setIsUploadingCustom(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument({ id: id as any });
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
      console.error(error);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'project':
        return <FolderOpen className="h-4 w-4" />;
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'work':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'project':
        return 'text-blue-500 bg-blue-500/10';
      case 'blog':
        return 'text-green-500 bg-green-500/10';
      case 'work':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-orange-500 bg-orange-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Knowledge Base Admin</h1>
          <p className="text-muted-foreground">
            Manage the AI assistant's knowledge base. Ingest data from your projects, blog posts, 
            work experience, or add custom content.
          </p>
        </div>

        {/* Ingest Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Ingestion
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Sync data from your database to the AI knowledge base. This will update existing entries
            and add new ones.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleIngestAll}
              disabled={isIngesting}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isIngesting ? 'animate-spin' : ''}`} />
              Ingest All Data
            </Button>
            <Button
              variant="outline"
              onClick={handleIngestProjects}
              disabled={isIngesting}
              className="gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Projects
            </Button>
            <Button
              variant="outline"
              onClick={handleIngestBlog}
              disabled={isIngesting}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Blog Posts
            </Button>
            <Button
              variant="outline"
              onClick={handleIngestWork}
              disabled={isIngesting}
              className="gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Work Experience
            </Button>
          </div>
        </Card>

        {/* Custom Content Upload */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Add Custom Content
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Add custom information that you want the AI assistant to know about. 
            This could be skills, interests, achievements, or any other relevant information.
          </p>
          <form onSubmit={handleUploadCustom} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Technical Skills, Interests, Certifications..."
                className="max-w-md"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1.5">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter the content you want the AI to know about. Markdown is supported."
                rows={6}
              />
            </div>
            <Button type="submit" disabled={isUploadingCustom} className="gap-2">
              <Upload className={`h-4 w-4 ${isUploadingCustom ? 'animate-pulse' : ''}`} />
              {isUploadingCustom ? 'Adding...' : 'Add to Knowledge Base'}
            </Button>
          </form>
        </Card>

        {/* Documents List */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Knowledge Base Documents
            {documents && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({documents.length} documents)
              </span>
            )}
          </h2>
          
          {!documents ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No documents in the knowledge base yet.</p>
              <p className="text-sm">Click "Ingest All Data" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getSourceColor(doc.source)}`}>
                        {getSourceIcon(doc.source)}
                        {doc.source}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm truncate">{doc.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {doc.content.slice(0, 150)}...
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc._id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

